/* Get CLI Args */
const commandArgs = process.argv.slice(2)

/* Load the required function */
const fn = require(`./functions/${commandArgs[0]}.js`)

/* Set up a runner to allow for async calls */
const runner = async arg => {
  /* Await fun execution */
  const resp = await fn(arg)

  console.log(resp)
}

/* Execute the runner */
runner(commandArgs[1])
