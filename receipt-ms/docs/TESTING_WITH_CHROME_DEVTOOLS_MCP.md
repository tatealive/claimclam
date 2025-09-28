# Testing with Chrome DevTools MCP

This document provides instructions for using Chrome DevTools MCP (Multiple Client Protocol) for advanced testing of the Receipt Management System.

## Setup

1.  **Install the MCP Server:**
    ```bash
    npm run mcp:install
    ```

2.  **Start the MCP Server:**
    ```bash
    npm run mcp:start
    ```

3.  **Start the application in development mode for MCP testing:**
    ```bash
    npm run test:mcp
    ```

## Running Tests

With the MCP server and the application running, you can now connect to the MCP server from the Chrome DevTools to perform advanced testing, such as:

*   Performance auditing
*   User behavior simulation
*   Live debugging
*   Network analysis

Refer to the official [Chrome DevTools MCP documentation](https://developer.chrome.com/blog/chrome-devtools-mcp) for more details on how to use it for testing.
