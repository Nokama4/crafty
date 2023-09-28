import { PostMessageUseCase, PostMessageCommand, Message, DateProvider, MessageTooLongError, EmptyMessageError } from "../post-message.usecase";
import { InMemoryMessageRepository } from "../message.inmemory.repository";

describe("Feature: Posting a message", () => {
    let fixture: Fixture;

    beforeEach(() => {
        fixture = createFixture();
    });
    describe("Rule: A message can contain up to 280 characters", () => {
        test("Alice can post a message on her timeline", () => {
            fixture.givenNowIs(new Date("2020-08-01T09:00:00.000Z"));

            fixture.whenUserPostsMessage({
                id: "message-id",
                text: "Hello world!",
                author: "Alice"
            })

            fixture.thenPostedMessageShouldBe({
                id: "message-id",
                text: "Hello world!",
                author: "Alice",
                publishedAt: new Date("2020-08-01T09:00:00.000Z")
            });
        });

        test("Alice cannot post a message with more than 280 characters", () => {
            const textWith281Characters = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mauris lacus, fringilla eu est vitae, varius viverra nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus suscipit feugiat sollicitudin. Aliquam erat volutpat amet.";

            fixture.givenNowIs(new Date("2020-08-01T09:00:00.000Z"));
            fixture.whenUserPostsMessage({
                id: "message-id",
                text: textWith281Characters,
                author: "Alice"
            });

            fixture.thenErrorShouldBe(MessageTooLongError);
        });

    });
    describe("Rule: A message cannot be empty", () => {
        test("Alice cannot post a message with an empty text", () => {
            fixture.givenNowIs(new Date("2020-08-01T09:00:00.000Z"));
            fixture.whenUserPostsMessage({
                id: "message-id",
                text: "",
                author: "Alice"
            });
            fixture.thenErrorShouldBe(EmptyMessageError);
        });
        test("Alice cannot post a message with only whitespaces", () => {
            fixture.givenNowIs(new Date("2020-08-01T09:00:00.000Z"));
            fixture.whenUserPostsMessage({
                id: "message-id",
                text: "  ",
                author: "Alice"
            });
            fixture.thenErrorShouldBe(EmptyMessageError);
        });

    })

});




class StubDateProvider implements DateProvider {
    now: Date;
    getNow(): Date {
        return this.now;
    }
}

const createFixture = () => {
    const dateProvider = new StubDateProvider();
    const messageRepository = new InMemoryMessageRepository();
    const postMessageUseCase = new PostMessageUseCase(
        messageRepository,
        dateProvider,
    );
    let thrownError: Error;

    return {
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        whenUserPostsMessage(postMessageCommand: PostMessageCommand) {
            try {
                postMessageUseCase.handle(postMessageCommand);

            }
            catch (error) {
                thrownError = error;
            }
        },
        thenPostedMessageShouldBe(expectedMessage: Message) {
            expect(expectedMessage).toEqual(messageRepository.message);

        },
        thenErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError).toBeInstanceOf(expectedErrorClass);
        },
    }
}

type Fixture = ReturnType<typeof createFixture>;
