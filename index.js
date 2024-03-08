import { Client } from "@notionhq/client"
import readlineSync from "readline-sync"
import dotenv from 'dotenv'

dotenv.config()
const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE

function main_menu() {
    console.log('Choose a function to use', '\n1. Test', "\n2. Add Week Labels")
    var i = readlineSync.question(">>").trim()
    let startDay= ''
    switch (i) {
        case '1': 
          console.log('Running test')
          startDay = readlineSync.question("What is the sunday before the first week of school? ")
          addWeeks(20, startDay, [8,9,10], 7,18)
          break
        case '2': 
          console.log('Enter dates in DD/MM/YYYY')
          // let weeks = readlineSync.question('How many weeks does the seme have? ')
          startDay = readlineSync.question("Enter Sunday before 1st day of school (in DD/MM/YYYY): ");
          let holi = readlineSync.question("Enter week numbers of school holidays (seperated by commas e.g 8,9,10) ").split(',');
          let mst = readlineSync.question("Enter MST week: ");
          let est = readlineSync.question("Enter EST week: ");
          // let exams = readlineSync.question("Which weeks are MST, EST and Exam weeks (enter week numbers seperated by commas)? ").split(',')
          addWeeks(20, startDay, holi, mst, est);
          break
    }
}
main_menu()

async function addItem(text) {
  try {
    const response = await notion.pages.create({
    "parent": { database_id: databaseId },
      "properties": {
        "title": {
          "title":[
            {
              "text": {
                "content": text
              }
            }
          ]
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

function convertDateStringtoISO(date) {
  let dateArr = date.split('/');
  return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
}

async function addWeeks(weeks, startDay, holi, mst, est) {
    let start = new Date(convertDateStringtoISO(startDay));
    console.log(start)
    var [starta] = start.toISOString().split('T');
    var days = [starta]

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf())
        date.setDate(date.getDate() + days);
        return date;
    }

    mst = parseInt(mst);
    est = parseInt(est);

    for(var j=0; j < weeks; j++) {
        let prev = new Date(days[j])
        let now = prev.addDays(7)
        var [e] = now.toISOString().split('T')
        days.push(e)
    }

    for(var i=1; i -1 < weeks ; i++) { 
      let weekItem = {
        "parent":{
            database_id: databaseId,
        },
        "properties": {
        "Name":{
            "type":"title",
            "title": [{"type":"text", "text":{"content":`Week ${i}`}}]
        },
        "Deadline":{
            "type":"date",
            "date":{"start":`${days[i-1]}`},
        },
        "Notes":{
          "type": "rich_text",
          "rich_text": [{
            "type":"text", 
            "text":{"content":""}
          }]
        }
        }
      }
      if ( holi.includes(i.toString()) ) { weekItem["properties"]["Notes"]["rich_text"][0]["text"]["content"] = "holiday"}
      else if (i == mst) {weekItem["properties"]["Notes"]["rich_text"][0]["text"]["content"] = "MST" }
      else if (i == est) {weekItem["properties"]["Notes"]["rich_text"][0]["text"]["content"] = "EST" }
      else if (i == weeks || i == weeks - 1) {weekItem["properties"]["Notes"]["rich_text"][0]["text"]["content"] = "Exam" }

      try {
      const response = await notion.pages.create(weekItem)
      console.log(response)
      console.log(`Success! Entry ${i} added.`)
      } catch (error) {
      console.log(weeks)
      console.log(i)
      console.error(error.body)
      }
    }
  }

async function addHBLs(text) {
  try {
    const response = await notion.pages.create({
    "parent": { database_id: databaseId },
      "properties": {
        "title": {
          "title":[
            {
              "text": {
                "content": text
              }
            }
          ]
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}