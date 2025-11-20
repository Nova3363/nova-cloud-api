
module.exports = async function processJob(job) {
  console.log("Processing job:", job.id, job.data);
  return true;
};
