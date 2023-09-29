import * as path from "path";
import * as fs from "fs";

import { Message, MessageRepository } from "./post-message.usecase";

export class FileSystemMessageRepository implements MessageRepository {
    async save(message: Message): Promise<void> {
        console.log({ message });
        return await fs.promises.writeFile(
            path.join(__dirname, "messages.json"),
            JSON.stringify(message),
        );
    }
}