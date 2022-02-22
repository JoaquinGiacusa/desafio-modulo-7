import algoliasearch from "algoliasearch";

const client = algoliasearch("S7UF8TSQG2", "a42c47d54823497cbf79c74cbddf8633");
const index = client.initIndex("pets");

export { index };
// index
//   .saveObject({
//     nombre: "Termo para mate",
//     price: 300,
//   })
//   .then((res) => {
//     console.log(res);
//   });
