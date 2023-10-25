# Apskrift frontend

I have provided an [installation script](./install.sh) in case you don't feel like setting environment variables yourself. This assumes you have bash on your system, of course.

```bash
./install.sh
npm run dev
```

If you don't want to run some stranger's bash script, you can simply do the following:

1. Create a `.env` file in the root of the `frontend` (where this README resides)
2. In `.env` set the following: `ROOT_DIR=/abs/path/to/apskrift/frontend`, i.e., set the env var to the root directory of the project
3. Install [`node.js`](https://nodejs.org/en) if you haven't
4. `npm i`
5. `npm run dev`
6. Apskrift should be up and running on `localhost:5173`, enjoy!
