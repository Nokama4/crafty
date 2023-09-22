import { PostMessageUseCase, PostMessageCommand, Message, MessageRepository, DateProvider } from "../post-message.usecase";

describe("Feature: Posting a message", () => {
    describe("Rule: A message can contain up to 280 characters", () => {
        test("Alice can post a message on her timeline", () => {
            givenNowIs(new Date("2020-08-01T09:00:00.000Z"));

            whenUserPostsMessage({
                id: "message-id",
                text: "Hello world!",
                author: "Alice"
            })

            thenPostedMessageShouldBe({
                id: "message-id",
                text: "Hello world!",
                author: "Alice",
                publishedAt: new Date("2020-08-01T09:00:00.000Z")
            });
        });
    });
});


let message: Message;
let now: Date;

class InMemoryMessageRepository implements MessageRepository {
    save(msg: Message): void {
        message = msg;
    }
}

class StubDateProvider implements DateProvider {
    now: Date;
    getNow(): Date {
        return this.now;
    }
}
const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider,
);

const givenNowIs = (_now: Date) => {
    dateProvider.now = _now;
};


function whenUserPostsMessage(postMessageCommand: PostMessageCommand) {
    postMessageUseCase.handle(postMessageCommand);
};

const thenPostedMessageShouldBe = (expectedMessage: Message) => {
    expect(expectedMessage).toEqual(message);

}

