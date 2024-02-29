import backstop from "backstopjs";

(async () => {
  console.log("Running test report");
  try {
    await backstop("test");
  } catch (error) {
    console.log("Failed running the command or test failed");
  }
  console.log("Finished!");
})();
