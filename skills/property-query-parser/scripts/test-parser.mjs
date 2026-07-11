import { parsePropertyQuery } from "./parse-property-query.mjs";

const tests = [
  {
    query: "Show me 3-bedroom condos in Irvine under $1.5M with a pool",
    expected: {
      city: "Irvine",
      maxPrice: 1500000,
      beds: 3,
      baths: null,
      sqft: null,
      type: "Condominium",
      pool: "True",
      hasView: null,
      maxHoa: null,
    },
  },
  {
    query: "Find a 2 bedroom townhouse in Anaheim under $700k",
    expected: {
      city: "Anaheim",
      maxPrice: 700000,
      beds: 2,
      baths: null,
      sqft: null,
      type: "Townhouse",
      pool: null,
      hasView: null,
      maxHoa: null,
    },
  },
  {
    query: "Show houses in Los Angeles under $900000",
    expected: {
      city: "Los Angeles",
      maxPrice: 900000,
      beds: null,
      baths: null,
      sqft: null,
      type: "SingleFamilyResidence",
      pool: null,
      hasView: null,
      maxHoa: null,
    },
  },
  {
    query: "Find a condo in Newport Beach with a view",
    expected: {
      city: "Newport Beach",
      maxPrice: null,
      beds: null,
      baths: null,
      sqft: null,
      type: "Condominium",
      pool: null,
      hasView: "True",
      maxHoa: null,
    },
  },
  {
    query: "Show me a 4 bed 3 bath house in Riverside",
    expected: {
      city: "Riverside",
      maxPrice: null,
      beds: 4,
      baths: 3,
      sqft: null,
      type: "SingleFamilyResidence",
      pool: null,
      hasView: null,
      maxHoa: null,
    },
  },
  {
    query: "Find homes in Pasadena with at least 2000 sq ft",
    expected: {
      city: "Pasadena",
      maxPrice: null,
      beds: null,
      baths: null,
      sqft: 2000,
      type: "SingleFamilyResidence",
      pool: null,
      hasView: null,
      maxHoa: null,
    },
  },
  {
    query: "Show land in San Bernardino under $300k",
    expected: {
      city: "San Bernardino",
      maxPrice: 300000,
      beds: null,
      baths: null,
      sqft: null,
      type: "UnimprovedLand",
      pool: null,
      hasView: null,
      maxHoa: null,
    },
  },
  {
    query: "Find a single family home in Long Beach with a pool",
    expected: {
      city: "Long Beach",
      maxPrice: null,
      beds: null,
      baths: null,
      sqft: null,
      type: "SingleFamilyResidence",
      pool: "True",
      hasView: null,
      maxHoa: null,
    },
  },
  {
    query: "Show condos in Santa Ana with HOA under $500",
    expected: {
      city: "Santa Ana",
      maxPrice: 500,
      beds: null,
      baths: null,
      sqft: null,
      type: "Condominium",
      pool: null,
      hasView: null,
      maxHoa: 500,
    },
  },
  {
    query: "Find a 2.5 bathroom townhouse in Orange under $850000",
    expected: {
      city: "Orange",
      maxPrice: 850000,
      beds: null,
      baths: 2.5,
      sqft: null,
      type: "Townhouse",
      pool: null,
      hasView: null,
      maxHoa: null,
    },
  },
];

let passed = 0;

for (const [index, test] of tests.entries()) {
  const actual = parsePropertyQuery(test.query);
  const success = JSON.stringify(actual) === JSON.stringify(test.expected);

  console.log(`\nTest ${index + 1}: ${success ? "PASS" : "FAIL"}`);
  console.log("Query:", test.query);
  console.log("Actual:", actual);
  console.log("Expected:", test.expected);

  if (success) {
    passed += 1;
  }
}

console.log(`\n${passed} of ${tests.length} tests passed.`);

if (passed !== tests.length) {
  process.exitCode = 1;
}
