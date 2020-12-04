import csv from "csvtojson";
import Logger from "../utils/Logger";
import { Database } from "../db";
import { Topic } from "../models/Topic";
import { Question } from "../models/Question";

async function getQuestionsData(topicsMap) {
  const jsonData = await readCSVData("./Questions and Topics - Questions.csv");

  return jsonData.map((question) => {
    const questionNumber = question["Question number"];
    delete question["Question number"];
    const topics = new Set();
    Object.keys(question).forEach((key) => {
      const value = question[key];
      if (value) topicsMap[value].forEach(topics.add, topics);
    });

    return { questionNumber, topics: Array.from(topics) };
  });
}

async function getTopicsMap() {
  Logger.debug("Start building topics map");
  const jsonData = await readCSVData("./Questions and Topics - Topics.csv");
  Logger.debug("Got CSV Data");
  // build inverse map of topics
  const map = {};
  Logger.debug("Start building map object");
  jsonData.forEach((row) => {
    const keys = Object.keys(row);
    const arr = [];
    keys.forEach((key) => {
      const value = row[key];
      arr.push(value);
      map[value] = map[value] ?? new Set();
      arr.forEach((val) => map[value].add(val));
    });
  });
  Logger.debug("Built map object, returning.");
  return map;
}

function readCSVData(path) {
  Logger.debug("Reading csv file data, path %s", path);

  return csv()
    .fromFile(path)
    .then((result) => {
      Logger.debug("Data read successfully, records count (%i)", result.length);
      return result;
    });
}

function saveTopics(topics) {
  const collection = Object.keys(topics)
    .filter((key) => key && topics[key]?.size)
    .map((key) => ({
      topic: key,
      parents: Array.from(topics[key]),
    }));

  // @ts-ignore
  return Topic.insertMany(collection);
}

async function initializer() {
  await Database.getInstance().getConnection();
  const topicsMap = await getTopicsMap();
  await saveTopics(topicsMap);
  const questions = await getQuestionsData(topicsMap);
  // @ts-ignore
  await Question.insertMany(questions);
}

initializer()
  .then(() => {
    Logger.info("Initialization Complete successfully");
  })
  .catch((err) => {
    Logger.error("Error happened while initialization: %j", err);
  });
