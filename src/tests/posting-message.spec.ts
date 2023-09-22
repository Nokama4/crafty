describe("Feature: Posting a message", () => {
    describe("Rule: A message can contain up to 280 characters", () => {
        test("Alice can post a message on her timeline", () => {
            givenNowIs(new Date("2020-08-01T09.00.00.000Z"));

            whenUserPostsMessage({
                id: "message-id",
                text: "Hello world!",
                author: "Alice"
            })

            thenpostedmessageShouldBe({
                id: "message-id",
                text: "Hello world!",
                author: "Alice",
                publishedAt: new Date("2020-08-01T09.00.00.000Z")
            });
        });
    });
});

const givenNowIs = (now: Date) => {};
const whenUserPostsMessage = (postMessageCommand: {
    id: string;
    text: string;
    author: string;
}) => {};
const thenpostedmessageShouldBe = (expectedMessage: {
    id: string;
    text: string;
    author: string;
    publishedAt: Date;
}) => {}