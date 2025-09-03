const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function processXmlReport(xmlPath) {
  const parser = new xml2js.Parser();
  const xmlContent = fs.readFileSync(xmlPath, "utf8");
  const result = await parser.parseStringPromise(xmlContent);

  const suites = result.testsuites.testsuite;
  let totalTests = 0,
    totalFailures = 0,
    totalSkipped = 0,
    totalTime = 0;

  const suiteDetails = suites.map((suite) => {
    const tests = parseInt(suite.$.tests);
    const failures = parseInt(suite.$.failures);
    const skipped = parseInt(suite.$.skipped);
    const time = parseFloat(suite.$.time);

    totalTests += tests;
    totalFailures += failures;
    totalSkipped += skipped;
    totalTime += time;

    const testCases = suite.testcase
      ? suite.testcase.map((test) => {
          const testInfo = {
            name: test.$.name,
            time: parseFloat(test.$.time),
            description: "",
            failure: test.failure || [], // Captura los fallos
          };

          if (test.properties && test.properties[0].property) {
            const properties = test.properties[0].property;
            const descProperty = properties.find(
              (prop) =>
                prop.$.value &&
                !prop.$.value.toString().trim().startsWith("fixme") &&
                prop.$.value.toString().trim() !== ""
            );

            if (descProperty) {
              testInfo.description = descProperty.$.value;
            }
          }

          if (test.skipped) {
            testInfo.time = 0;
          }

          return testInfo;
        })
      : [];

    return {
      name: suite.$.name,
      tests,
      failures,
      skipped,
      time,
      testCases,
    };
  });

  return { totalTests, totalFailures, totalSkipped, totalTime, suiteDetails };
}

function getTestStatus(test) {
  if (test.time === 0)
    return { label: "Skipped", color: "#f39c12", bgColor: "#fff3e0" };

  if (test.failure && test.failure.length > 0)
    return { label: "Failed", color: "#e74c3c", bgColor: "#fde8e7" };

  return { label: "Passed", color: "#27ae60", bgColor: "#e8f5e9" };
}

function generateMetricsHTML(label, value, color, percentage = 100) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
      <tr>
        <td width="50%" style="text-align: left;">
          <span style="color: #345; font-weight: 500;">${label}</span>
        </td>
        <td width="50%" style="text-align: right;">
          <span style="font-size: 24px; font-weight: 600; color: ${color};">${value}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top: 8px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background-color: #e2e8f0; height: 8px; border-radius: 4px;">
                <table width="${percentage}%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background-color: ${color}; height: 8px; border-radius: 4px;"></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function generateHtmlReport({
  totalTests,
  totalFailures,
  totalSkipped,
  totalTime,
  suiteDetails,
}) {
  const cleanSuiteName = (name) => {
    return name
      .replace(/^(e2e-|payment\\)/i, "")
      .replace(/^specs[\/\\]public-api[\/\\]/i, "")
      .replace(/\.spec\.ts$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/api/i, "API")
      .trim();
  };

  const tableRows = suiteDetails
    .map(
      (suite, index) => `
      <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f8f9fa"};">
        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; width: 70%;">
          <div style="font-weight: 500;">${cleanSuiteName(suite.name)}</div>
          ${suite.testCases
            .map((test) => {
              const status = getTestStatus(test);
              return `
                <div style="margin-left: 10px; padding: 4px 0;">
                  <div style="display: flex; gap: 8px;">
                    <div style="flex-shrink: 0; padding-top: 3px;">
                      <span style="
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 0.75em;
                        background: ${status.bgColor};
                        color: ${status.color};
                        font-weight: 500;
                        white-space: nowrap;
                      ">${status.label}</span>
                    </div>
                    <div style="flex: 1;">
                      <div style="color: #345;">${test.name
                        .split("›")
                        .pop()
                        .trim()}</div>
                      ${
                        test.description
                          ? `<div style="color: #666; font-size: 0.85em; font-style: italic;">${test.description}</div>`
                          : ""
                      }
                    </div>
                    <div style="flex-shrink: 0; color: #666; min-width: 60px; text-align: right;">
                      ${test.time > 0 ? `${test.time.toFixed(2)}s` : "-"}
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center; vertical-align: middle; width: 7.5%;">${
          suite.tests
        }</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center; vertical-align: middle; width: 7.5%; color: ${
          suite.failures > 0 ? "#e74c3c" : "#27ae60"
        }; font-weight: ${suite.failures > 0 ? "bold" : "normal"};">${
        suite.failures
      }</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center; vertical-align: middle; width: 7.5%;">${
          suite.skipped
        }</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center; vertical-align: middle; width: 7.5%;">${suite.time.toFixed(
          2
        )}s</td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;">
      <div style="text-align: right; color: #666; font-size: 0.9em; margin-bottom: 20px;">
        Execution Date: ${new Date().toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "medium",
        })}
      </div>

      <h2 style="color: #2E86C1; border-bottom: 2px solid #2E86C1; padding-bottom: 10px; margin-bottom: 20px;">
        Automated Test Results
      </h2>
      
      <p style="color: #345; font-size: 1.1em; margin-bottom: 30px;">
        The execution results of the automated tests are now available.
      </p>
      
      <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #345; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 1px solid #dee2e6;">Summary Report</h3>
        
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${generateMetricsHTML("Total Tests", totalTests, "#2E86C1")}
          ${generateMetricsHTML(
            "Failed",
            totalFailures,
            totalFailures > 0 ? "#e74c3c" : "#27ae60",
            (totalFailures / totalTests) * 100 || 0
          )}
          ${generateMetricsHTML(
            "Skipped",
            totalSkipped,
            "#f39c12",
            (totalSkipped / totalTests) * 100
          )}
          ${generateMetricsHTML(
            "Total Time",
            totalTime.toFixed(2) + "s",
            "#2E86C1"
          )}
        </div>
      </div>

      <h3 style="color: #345; margin-bottom: 15px;">Details by Suite</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #2E86C1;">
              <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #dee2e6; color: white; font-weight: 600; width: 70%;">Suite</th>
              <th style="padding: 12px 15px; text-align: center; border-bottom: 2px solid #dee2e6; color: white; font-weight: 600; width: 7.5%;">Total</th>
              <th style="padding: 12px 15px; text-align: center; border-bottom: 2px solid #dee2e6; color: white; font-weight: 600; width: 7.5%;">Failed</th>
              <th style="padding: 12px 15px; text-align: center; border-bottom: 2px solid #dee2e6; color: white; font-weight: 600; width: 7.5%;">Skipped</th>
              <th style="padding: 12px 15px; text-align: center; border-bottom: 2px solid #dee2e6; color: white; font-weight: 600; width: 7.5%;">Time</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; font-size: 0.9em; color: #666;">
        <p style="margin: 0 0 10px 0;"><strong>Note:</strong> The detailed native Playwright report is included in the ZIP file attached to this email.</p>
        <p style="margin: 0;">Report generated by the QA team</p>
      </div>
    </div>
  `;
}

async function sendEmail({ xmlPath, zipPath, subject }) {
  const { totalTests, totalFailures, totalSkipped, totalTime, suiteDetails } =
    await processXmlReport(xmlPath);

  const htmlBody = generateHtmlReport({
    totalTests,
    totalFailures,
    totalSkipped,
    totalTime,
    suiteDetails,
  });

  const attachments = [];
  if (fs.existsSync(zipPath)) {
    attachments.push({
      filename: path.basename(zipPath),
      path: zipPath,
    });
  }

  const mailOptions = {
    from: `"Automation Email Reporter" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENTS,
    subject,
    html: htmlBody,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado exitosamente con asunto: ${subject}`);
  } catch (error) {
    console.error(`Error al enviar el correo con asunto ${subject}:`, error);
  }
}

async function sendTestResults() {
  const apiXmlPath = path.join(
    __dirname,
    "../../results/test-results-api/api-junit-results.xml"
  );
  const apiZipPath = path.join(__dirname, "../../results/playwright-report-api.zip");
  const apiSubject = "Automated Test Results - API";

  const e2eXmlPath = path.join(
    __dirname,
    "../../results/test-results-e2e/e2e-junit-results.xml"
  );
  const e2eZipPath = path.join(__dirname, "../../results/playwright-report-e2e.zip");
  const e2eSubject = "Automated Test Results - E2E";

  if (fs.existsSync(apiXmlPath)) {
    await sendEmail({
      xmlPath: apiXmlPath,
      zipPath: apiZipPath,
      subject: apiSubject,
    });
  } else {
    console.warn("Archivo XML de API no encontrado.");
  }

  if (fs.existsSync(e2eXmlPath)) {
    await sendEmail({
      xmlPath: e2eXmlPath,
      zipPath: e2eZipPath,
      subject: e2eSubject,
    });
  } else {
    console.warn("Archivo XML de E2E no encontrado.");
  }
}

sendTestResults();
