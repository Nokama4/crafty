#!/usr/bin/env node

import { Command } from 'commander';
import { DateProvider, PostMessageCommand, PostMessageUseCase } from './src/post-message.usecase';
import { FileSystemMessageRepository } from './src/message.fs.repository';

class RealDateProvider implements DateProvider {
    getNow(): Date {
        return new Date();
    }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider);
const program = new Command();

program
    .version('0.0.1')
    .description("Crafty social network")
    .addCommand(
        new Command("post")
            .argument("<User>", "the currentUser")
            .argument("<Message>", "the message to post")
            .action(async (user, message) => {
                const postMessageCommand: PostMessageCommand = {
                    id: "some-id",
                    author: user,
                    text: message,
                };
                try {
                    await postMessageUseCase.handle(postMessageCommand);
                    console.log("Message posted");
                    process.exit(0);
                } catch (error) {
                    console.log(error);
                    process.exit(1);
                }

            })
    )


async function main() {
    await program.parseAsync();
}

main();