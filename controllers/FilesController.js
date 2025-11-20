import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dbClient from "../utils/db.js";
import redisClient from "../utils/redis.js";

class FilesController {
  // POST /files
  static async postUpload(req, res) {
    const token = req.headers["X-Token"];
    if (token) {
      } else
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // get userId from redis
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // validate file size
    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    // validate inputs
    if (!name) return res.status(400).json({ error: "Missing name" });
    if (!["folder", "file", "image"].includes(type))
      return res.status(400).json({ error: "Missing type" });
    if (type !== "folder" && !data)
      return res.status(400).json({ error: "Missing data" });

    // validate parent folder

    if (parentId !== 0) {
      const parentFile = await dbClient.db
        .collection("files")
        .findOne({ _id: parentId });
      if (!parentFile)
        return res.status(400).json({ error: "Parent not found" });
      if (parentFile.type !== "folder")
        return res.status(400).json({ error: "Parent is not a folder" });
    }

    // handle file storage
    let localPath = null;
    let fileUUID = null;

    // save file to local storage
    if (type !== "folder") {
      const folderPath = process.env.FOLDER_PATH || "/tmp/files_manager";
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });

      // generate unique file name and save file to local storage
      fileUUID = uuidv4();
      localPath = path.join(folderPath, fileUUID);
      const fileData = Buffer.from(data, "base64");
      fs.writeFileSync(localPath, fileData);
    }
    // save file to database
    const fileDoc = {
      userId,
      name,
      type,
      isPublic,
      parentId,
      data: type !== "folder" ? fileUUID : null,
      ...(localPath && { localPath }),
    };

    const result = await dbClient.db.collection("files").insertOne(fileDoc);

    // update parent folder if necessary
    return res.status(201).json({
      id: result.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  // GET /files
  static async getFiles(req, res) {
    const token = req.headers['X-Token'];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const fileId = req.params.id;
    const file = await dbClient.db
      .collection("files")
      .findOne({ _id: fileId, userId });

    if (!file) return res.status(404).json({ error: "Not found" });

    return res.status(200).json(file);
  }

  // GET /files
  static async getIndex(req, res) {
    const token = req.headers['X-Token'];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const parentId = req.query.parentId || 0;
    const page = parseInt(req.query.page) || 0;
    const pageSize = 20;

    const files = await dbClient.db
      .collection("files")
      .find({ userId, parentId })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    return res.status(200).json(files);
  }
}

export default FilesController;

