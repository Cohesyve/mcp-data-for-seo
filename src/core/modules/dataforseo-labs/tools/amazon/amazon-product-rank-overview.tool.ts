import { z } from "zod";
import { DataForSEOClient } from "../../../../client/dataforseo.client.js";
import { BaseTool } from "../../../base.tool.js";

export class AmazonProductRankOverviewTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return "dataforseo_labs_amazon_product_rank_overview";
  }

  getDescription(): string {
    return `This endpoint will provide you with ranking data from organic and paid Amazon SERPs for the target products. The returned results are specific to the ASINs specified in a POST request. Data updates: data is updated weekly. Learn more about ASIN in the DataForSEO help center.`;
  }

  getParams(): z.ZodRawShape {
    return {
      asins: z.array(z.string()).max(1000).describe(`product IDs to compare
required field
product IDs to receive ranking data for
the maximum number of ASINs you can specify in this array is 1000
you can receive the asin parameter by making a separate request to the Amazon Products endpoint
Note: all letters in ASIN code must be specified in uppercase format
example: ["B01LW2SL7R", "B001TJ3HUG"]`),
      location_name: z.string().optional().describe(`full name of the location
required field if you don't specify location_code
Note: this endpoint currently supports the US, Egypt, Saudi Arabia, and the United Arab Emirates locations only
example: United States`),
      location_code: z.number().optional().describe(`location code
required field if you don't specify location_name
Note: this endpoint currently supports the US, Egypt, Saudi Arabia, and the United Arab Emirates locations only
example: 2840`),
      language_name: z.string().optional().describe(`full name of the language
required field if you don't specify language_code
example: English`),
      language_code: z.string().optional().describe(`language code
required field if you don't specify language_name
example: en`)
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        "/v3/dataforseo_labs/amazon/product_rank_overview/live",
        "POST",
        [
          {
            asins: params.asins,
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
