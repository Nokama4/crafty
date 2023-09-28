#!/usr/bin/env node

import { Command } from 'commander';
import { DateProvider, PostMessageCommand, PostMessageUseCase } from './src/post-message.usecase';
import { InMemoryMessageRepository } from './src/message.inmemory.repository';

class RealDateProvider implements DateProvider {
    getNow(): Date {
        return new Date();
    }
}

const messageRepository = new InMemoryMessageRepository();
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
            .action((user, message) => {
                const postMessageCommand: PostMessageCommand = {
                    id: "some-id",
                    author: user,
                    text: message,
                };
                try {
                    postMessageUseCase.handle(postMessageCommand);
                    console.log("Message posted");
                    console.table([messageRepository.message]);
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