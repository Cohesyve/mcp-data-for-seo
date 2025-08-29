import { z } from "zod";
import { DataForSEOClient } from "../../../../client/dataforseo.client.js";
import { BaseTool } from "../../../base.tool.js";

export class AmazonProductCompetitorsTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return "dataforseo_labs_amazon_product_competitors";
  }

  getDescription(): string {
    return `This endpoint will provide you with a list of products that intersect with a target ASIN in Amazon SERPs. The data can help you identify product competitors for any listing published on Amazon. The returned results are specific to the ASIN as well as the location and language parameters specified in a POST request. Data updates: data is updated weekly. Learn more about ASIN in the DataForSEO help center.`;
  }

  getParams(): z.ZodRawShape {
    return {
      asin: z.string().describe(`product ID
required field
unique product identifier (ASIN) on Amazon
you can receive the asin parameter by making a separate request to the Amazon Products endpoint
example: 019005476X`),
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
example: en`),
      limit: z.number().int().min(1).max(1000).optional().describe(`the maximum number of products in the results array
optional field
default value: 100
maximum value: 1000`),
      filters: z.array(z.any()).optional().describe(`array of results filtering parameters
optional field
you can add several filters at once (8 filters maximum)
you should set a logical operator and, or between the conditions
the following operators are supported: regex, not_regex, <, <=, >, >=, =, <>, in, not_in, ilike, not_ilike, like, not_like, match, not_match
you can use the % operator with like and not_like, as well as ilike and not_ilike to match any string of zero or more characters
example: ["full_metrics.amazon_serp.pos_1",">", 20]`),
      order_by: z.array(z.string()).optional().describe(`results sorting rules
optional field
you can use the same values as in the filters array to sort the results
possible sorting types: asc – results will be sorted in the ascending order, desc – results will be sorted in the descending order
you should use a comma to set up a sorting parameter
example: ["full_metrics.amazon_serp.pos_1,desc"]
note that you can set no more than three sorting rules in a single request
you should use a comma to separate several sorting rules
example: ["full_metrics.amazon_serp.pos_1,desc","avg_position,desc"]
default rule: ["ranked_serp_element.serp_item.rank_group,asc"]`),
      offset: z.number().int().min(0).optional().describe(`offset in the results array of returned product competitors
optional field
default value: 0
if you specify the 10 value, the first ten product competitors in the results array will be omitted and the data will be provided for the successive product competitors`)
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        "/v3/dataforseo_labs/amazon/product_competitors/live",
        "POST",
        [
          {
            asin: params.asin,
            location_name: params.location_name,
            location_code: params.location_code,
            language_name: params.language_name,
            language_code: params.language_code,
            limit: params.limit,
            filters: params.filters,
            order_by: params.order_by,
            offset: params.offset
          },
        ]
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
