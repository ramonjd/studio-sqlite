# Studio SQLite

A React + TypeScript + Vite project.

## Install

```
npm install
cd frontend && npm install
```

## Development

In one console, run the node server and backend src watcher:

`npm run dev`

Then run the vite frontend build/server:

`npm run dev:frontend`

Go to `localhost:5173`

## AI
Add your OPEN AI key to `.env` file

## Run production build

`npm start`

Go to `localhost:3000`

## Build

`npm run build`

## Integrate express middleware 


```
import { default as StudioSQLiteMiddleware } from 'studio-sqlite';

const app = express();

// Use the database middleware, passing the path to the SQLite database file.
app.use('/', StudioSQLiteMiddleware( app, path.join(__dirname, './path/to/.ht.sqlite') ) );

// Start the server.
app.listen( 3000, () => console.log( 'Server running on http://localhost:3000' ) );
```



