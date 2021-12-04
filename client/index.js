import RedirinkApiClient from "./client.js";

try {
  const { key } = await RedirinkApiClient.signin("admin", "admin");
  console.log(`Your token: ${key}`);

  const client = new RedirinkApiClient(key);

  const users = await client.getUsers();
  console.log("Users:");
  for (const user of users) {
    console.log(user);
  }

  //   await client.createLink("https://vk.com");

  const links = await client.getLinks();
  console.log("Links:");
  links.results.forEach((link) => console.log(link));
} catch (error) {
  console.log(error.message);
}
