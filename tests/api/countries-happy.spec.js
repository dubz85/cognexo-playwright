import { test, expect } from "@playwright/test";

const GQL = "https://countries.trevorblades.com/";

test.describe("GraphQL Happy Path — Countries API", () => {
  test("Get total number of countries", async ({ request }) => {
    const query = `
      query {
        countries {
          code
        }
      }
    `;

    const resp = await request.post(GQL, { data: { query } });
    expect(resp.status()).toBe(200);

    const body = await resp.json();
    expect(body.errors).toBeUndefined();

    const totalCountries = body.data.countries.length;
    console.log("Total number of countries:", totalCountries);

    expect(totalCountries).toBeGreaterThan(0);
  });

  test("Fetch country by code GB", async ({ request }) => {
    const query = `
        query GetCountry($code: ID!) {
          country(code: $code) {
            code
            name
            emoji
            capital
            continent { name }
          }
        }
      `;
    const variables = { code: "GB" };
    const resp = await request.post(GQL, { data: { query, variables } });

    expect(resp.status()).toBe(200);

    const body = await resp.json();
    console.log("GB Response:", JSON.stringify(body, null, 2));

    expect(body.errors).toBeUndefined();
    const country = body.data.country;
    expect(country.code).toBe("GB");
    expect(country.name).toBeTruthy();
    expect(country.capital).toBeTruthy();
    expect(country.continent.name).toBeTruthy();
  });

  test("Fetch country by code US", async ({ request }) => {
    const query = `
        query GetCountry($code: ID!) {
          country(code: $code) {
            code
            name
            capital
            languages { code name }
            continent { name }
          }
        }
      `;
    const variables = { code: "US" };
    const resp = await request.post(GQL, { data: { query, variables } });

    expect(resp.status()).toBe(200);

    const body = await resp.json();
    console.log("US Response:", JSON.stringify(body, null, 2));

    expect(body.errors).toBeUndefined();
    const country = body.data.country;
    expect(country.code).toBe("US");
    expect(country.name).toBeTruthy();
    expect(country.capital).toBeTruthy();
    expect(country.continent.name).toBeTruthy();
  });

  test("Fetch multiple countries using different codes and currencies", async ({
    request,
  }) => {
    const codes = ["FR", "DE", "JP"];
    const query = `
    query GetCountry($code: ID!) {
      country(code: $code) {
        code
        name
        capital
        currencies
        continent { name }
      }
    }
  `;

    for (const code of codes) {
      const resp = await request.post(GQL, {
        data: { query, variables: { code } },
      });
      expect(resp.status()).toBe(200);

      const body = await resp.json();
      console.log(`${code} Response:`, JSON.stringify(body, null, 2));

      expect(body.errors).toBeUndefined();
      const country = body.data.country;

      expect(country.code).toBe(code);
      expect(country.name).toBeTruthy();
      expect(country.capital).toBeTruthy();
      expect(country.continent.name).toBeTruthy();

      console.log(`Currencies for ${country.name}:`);
      country.currencies.forEach((currency) => console.log(currency));
    }
  });

  test("Fetch continent data for a country", async ({ request }) => {
    const query = `
        query GetCountry($code: ID!) {
          country(code: $code) {
            name
            continent {
              code
              name
            }
          }
        }
      `;
    const variables = { code: "BR" };
    const resp = await request.post(GQL, { data: { query, variables } });

    expect(resp.status()).toBe(200);

    const body = await resp.json();

    expect(body.errors).toBeUndefined();
    const country = body.data.country;
    expect(country.name).toBeTruthy();
    expect(country.continent.code).toBeTruthy();
    expect(country.continent.name).toBeTruthy();
  });

  test("Fetch countries by code and validate types", async ({ request }) => {
    const query = `
        query GetCountry($code: ID!) {
          country(code: $code) {
            code
            name
            capital
            currency
            languages { code name }
          }
        }
      `;
    const variables = { code: "IN" };
    const resp = await request.post(GQL, { data: { query, variables } });

    expect(resp.status()).toBe(200);

    const body = await resp.json();

    expect(body.errors).toBeUndefined();
    const country = body.data.country;

    expect(country.code).toBe("IN");
    expect(typeof country.name).toBe("string");
    expect(typeof country.capital).toBe("string");
    expect(typeof country.currency).toBe("string");
    expect(Array.isArray(country.languages)).toBe(true);
    country.languages.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
    });
  });
});
