import { test, expect } from "@playwright/test";

const GQL = "https://countries.trevorblades.com/";

test.describe("GraphQL Negative Path", () => {
  test("Invalid field returns errors", async ({ request }) => {
    const query = `
      query BadQuery($code: ID!) {
        country(code: $code) {
          code
          fakeField
        }
      }
    `;
    const variables = { code: "US" };
    const resp = await request.post(GQL, { data: { query, variables } });

    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.errors).toBeDefined();
    const messages = body.errors.map((e) => e.message).join(" ");
    expect(messages.toLowerCase()).toContain("cannot query field");
  });

  test("Non-existent country code returns null", async ({ request }) => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) {
          code
          name
        }
      }
    `;
    const variables = { code: "ZZ" };
    const resp = await request.post(GQL, { data: { query, variables } });

    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.country).toBeNull();
  });

  test("Missing variable returns errors", async ({ request }) => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) {
          code
          name
        }
      }
    `;
    const resp = await request.post(GQL, { data: { query } });

    expect([200, 400]).toContain(resp.status());
    const body = await resp.json();
    expect(body.errors).toBeDefined();
    const messages = body.errors.map((e) => e.message).join(" ");
    expect(messages.toLowerCase()).toContain(
      'variable "$code" of required type'
    );
  });

  test("Invalid query syntax returns errors", async ({ request }) => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) {
          code
          name
    `;
    const variables = { code: "US" };
    const resp = await request.post(GQL, { data: { query, variables } });

    expect([200, 400]).toContain(resp.status());
    const body = await resp.json();
    expect(body.errors).toBeDefined();
    const messages = body.errors.map((e) => e.message).join(" ");
    expect(messages.toLowerCase()).toContain(
      "the request did not contain a valid graphql request"
    );
  });

  test("Totally invalid request returns 400", async ({ request }) => {
    const invalidPayload = { invalid: "data" };
    const resp = await request.post(GQL, { data: invalidPayload });

    expect(resp.status()).toBe(400);
  });

  test("Simulate 500 server error response (API mock)", async ({ request }) => {
    const fakeResponse = {
      status: () => 500,
      json: async () => ({ error: "Internal Server Error" }),
    };

    expect(fakeResponse.status()).toBe(500);
    const body = await fakeResponse.json();
    expect(body.error).toBe("Internal Server Error");
  });
});
