import { z } from "zod";
import { DataForSEOClient } from "../../../../client/dataforseo.client.js";
import { BaseTool } from "../../../base.tool.js";

export class AmazonBulkSearchVolumeTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return "dataforseo_labs_amazon_bulk_search_volume";
  }

  getDescription(): string {
    return `The Amazon Bulk Search Volume endpoint will provide you with search volume values for a maximum of 1,000 keywords in one API request. Here search volume represents the approximate number of monthly searches for a keyword on Amazon. The returned results are specific to the keywords, location, and language parameters specified in a POST request.`;
  }

  getParams(): z.ZodRawShape {
    return {
      keywords: z.array(z.string()).max(1000).describe(`target keywords
required field
UTF-8 encoding
maximum number of keywords you can specify in this array: 1000;
the keywords will be converted to lowercase format`),
      location_name: z.string().optional().describe(`full name of the location
required field if don’t specify location_code
example:
United States`),
      location_code: z.number().optional().describe(`location code
required field if don’t specify location_name
example:
2840`),
      language_name: z.string().optional().describe(`full name of the language
required field if don’t specify language_code
example:
English`),
      language_code: z.string().optional().describe(`language code
required field if don’t specify language_name
example:
en`),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        "/v3/dataforseo_labs/amazon/bulk_search_volume/live",
        "POST",
        [
          {
            keywords: params.keywords,
            location_name: params.location_name,
            location_code: params.location_code,
            language_name: params.language_name,
            language_code: params.language_code
          },
        ]
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
