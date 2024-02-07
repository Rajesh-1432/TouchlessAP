require("dotenv").config();
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const fs = require("fs");
const pdf = require("pdf-parse");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const imapConfig = {
  user: "rajeshdumpala1432@gmail.com",
  password: "swra nwui zpam nzlj",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
};
const parseTextToJSON = (pdfText) => {
  const lines = pdfText.split('\n');
  const jsonResult = {
    companyName: lines[2],
    po_number: lines[5].split(" ")[1],
    quantity: lines[9].split( " ")[2],
    Amount: lines[10].split( " ")[1],

  };
console.log(lines.length);
  return jsonResult;
};


const getEmails = () => {
  try {
    const imap = new Imap(imapConfig);
    imap.once("ready", () => {
      imap.openBox("INBOX", false, () => {
        imap.search(["UNSEEN", ["SINCE", new Date()]], (err, results) => {
          const f = imap.fetch(results, { bodies: "" });
          f.on("message", (msg) => {
            msg.on("body", (stream) => {
              simpleParser(stream, async (err, parsed) => {
                const { from, subject, textAsHtml, text, attachments } = parsed;
                //checking whether atachment is pdf or not
                if (attachments[0].contentType === "application/pdf") {
                  const pdfbuffer = attachments[0].content;
                  console.log(pdfbuffer);
                  //convertt pdfbufffer TO String
                  pdf(pdfbuffer).then(async (data) => {
                    const pdfText = data.text;
                    console.log(pdfText);
                    try {
                      // Convert PDF text to JSON 
                      const jsonFromText = parseTextToJSON(pdfText);
                      console.log(jsonFromText); // Now you have the JSON object
                    }
                    catch (jsonError) {
                      console.error("Error parsing PDF text as JSON:", jsonError.message);
                    }
                  });
                }
                else {
                  console.log("Attachment is not a PDF");
                }


                content = fs.writeFile("attachment.pdf", pdfbuffer, (err) => {
                  if (err) {
                    console.error("Error writing PDF file:", err);
                  } else {
                    console.log("PDF file has been successfully created.");
                  }
                });
                const json = pdfbuffer.toJSON();
              
              });
            });
            msg.once("attributes", (attrs) => {
              const { uid } = attrs;
              imap.addFlags(uid, ["\\Seen"], () => {
                // Mark the email as read after reading it
                console.log("Marked as read!");
              });
            });
          });
          f.once("error", (ex) => {
            return Promise.reject(ex);
          });
          f.once("end", () => {
            console.log("Done fetching all messages!");
            imap.end();
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.log(err);
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (ex) {
    console.log("an error occurred");
  }
};

getEmails();