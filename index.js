export default {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);
    const steamID64 = searchParams.get("steamID64");

    if (!steamID64) {
      return new Response(JSON.stringify({ error: "Missing steamID64" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const res = await fetch(`https://api.stratz.com/api/v1/Player/${steamID64}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNGQzZWZkNmEtMjk2ZS00NDExLTkzYzItNDUzMTdjZGUxY2I1IiwiU3RlYW1JZCI6IjE0NDczMzQyOCIsIkFQSVVzZXIiOiJ0cnVlIiwibmJmIjoxNzU0MTQ5OTA2LCJleHAiOjE3ODU2ODU5MDYsImlhdCI6MTc1NDE0OTkwNiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.eCUIrN44qvmccR92xlqzDSnlfCKMurB-QMaFoj72Pn8`
        }
      });

      if (!res.ok) {
        return new Response(JSON.stringify({ error: "Stratz API error", status: res.status }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await res.json();

      const result = {
        mmrEstimate: data.mmrEstimate ?? "Not found",
        winRate: data.statistics?.winRate?.toFixed(2) ?? "-",
        matchCount: data.matchCount ?? 0,
        country: data.steamAccount?.countryCode ?? ""
      };

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
