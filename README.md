## AI Chat

### Usage
`npm install`  
`npm run build`  
`npm run start`

### Requirements Completed
*Level 1*  
Select model: the user should be able to choose between: gpt-4o and claude-4-sonnet.  
Chat: the user should be able to chat with the selected model and see the responses in a chat interface.  
Chat History: the user should be able to see the chat history and create new chats.  
Set up a local SQLite database to store the chat history.  

*Level 2*  
Chat compaction: the chat should automatically "compact" (summarize and add to system prompt) older messages if the context window gets to 20%.  

### Dependencies
The project has no dependencies outside the provided tech stack.  
I used ShadCN UI for quickly creating UI components.

### AI Agent Usage
I used Cursor chat to assist with the development. I provided clear short goals and exact requirements, then reviewed and tested the code. I find these agents work best when asked to do a specific part of the overall problem rather than asking it to provide the whole solution.

### Thoughts
Really fun take-home. I enjoyed working on this a lot. The biggest challenge I faced was managing the trade-off between depth and breadth—whether to fully implement a few tasks with solid structure or cover more ground. Given the time constraints, I decided to prioritize building and testing a smaller set of features thoroughly.

It was also difficult to gague how much time I spent working on it. I just set up a stopwatch that I started every time I worked on the project and I worked 6 hours, without including this readme and some time researching prior to starting)
