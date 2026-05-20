const fs = require("fs");

const originalReadlink = fs.readlink;
const originalReadlinkSync = fs.readlinkSync;
const originalPromisesReadlink = fs.promises.readlink.bind(fs.promises);

fs.readlink = function patchedReadlink(path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  return originalReadlink.call(fs, path, options, (error, linkString) => {
    if (error && error.code === "EISDIR") {
      error.code = "EINVAL";
      callback(error);
      return;
    }
    callback(error, linkString);
  });
};

fs.readlinkSync = function patchedReadlinkSync(path, options) {
  try {
    return originalReadlinkSync.call(fs, path, options);
  } catch (error) {
    if (error && error.code === "EISDIR") {
      error.code = "EINVAL";
    }
    throw error;
  }
};

fs.promises.readlink = async function patchedPromisesReadlink(path, options) {
  try {
    return await originalPromisesReadlink(path, options);
  } catch (error) {
    if (error && error.code === "EISDIR") {
      error.code = "EINVAL";
    }
    throw error;
  }
};

process.argv = [process.argv[0], require.resolve("next/dist/bin/next"), "build"];
require("next/dist/bin/next");
