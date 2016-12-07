
var
      @post_uri = "#{api_spec['base_url']}/?accountID=#{credentials["account_id"]}&secretKey=#{credentials["secret_key"]}"
require 'rest-client'
require 'json'
require 'jsonpath'

module Services::Connectors::Sharpspring
  class Integration
    attr_accessor :has_more, :processor

    GET_OBJECT_METHOD = {
      'lead' => 'getLeads',
      'user' => 'getUserProfiles',
      'dealStage' => 'getDealStages',
      'opportunityLead' => 'getOpportunityLeads'
    }

    GET_OBJECT_DATE_RANGE_METHOD = {
      'lead' => 'getLeadsDateRange'
    }

    CREATE_OBJECT_METHOD = {
      'lead' => 'createLeads',
      'opportunityLead' => 'createOpportunityLeads',
      'opportunity' => 'createOpportunities'
    }

    UPDATE_OBJECT_METHOD = {
      'lead' => 'updateLeads',
      'opportunity' => 'updateOpportunities'
    }

    DELETE_OBJECT_METHOD = {
      'lead' => 'deleteLeads'
    }

    def initialize(credentials, api_spec)
    end

    def cleanup
      @has_more = false
    end

    def get_recently_updated_leads(timestamp)
      get_recent_leads(timestamp, {"timestamp_type": "update"})
    end

    def get_recently_created_leads(timestamp)
      get_recent_leads(timestamp, {"timestamp_type": "create"})
    end

    def get_recent_leads(timestamp, inputs)
      start_date = (timestamp - 3600).strftime("%Y-%m-%d %H:%M:%S")
      end_date = timestamp.strftime("%Y-%m-%d %H:%M:%S")

      api_method = GET_OBJECT_DATE_RANGE_METHOD["lead"]
      params = {
        startDate: start_date,
        endDate: end_date,
        timestamp: inputs['timestamp_type']
      }
      return_field = "lead"
      response = make_api_call(api_method, params)
      result = JsonPath.on(response, "$.result.#{return_field}[:]")
      @has_more = false # sharpspring does not expose limit/offset for these queries

      return result
    end

    def find_dealstages(inputs)
      api_method = GET_OBJECT_METHOD["dealStage"]
      params = {where: {}}
      return_field = "dealStage"
      response = make_api_call(api_method, params)
      results = JsonPath.on(response, "$.result.#{return_field}[:]")
      return results
    end

    def find_dealstage(inputs)
      results = find_dealstages({})
      return results.select { |result| result['dealStageName'] == inputs['dealStageName'] }
    end

    def find_user(inputs)
      api_method = GET_OBJECT_METHOD["user"]
      params = {where: inputs}
      return_field = "userProfile"
      response = make_api_call(api_method, params)
      results = JsonPath.on(response, "$.result.#{return_field}[:]")
      return results.first
    end

    def find_opportunity_leads(inputs)
      api_method = GET_OBJECT_METHOD["opportunityLead"]
      params = {where: inputs}
      return_field = "opportunityLead"
      response = make_api_call(api_method, params)
      results = JsonPath.on(response, "$.result.#{return_field}[:]")
      return results
    end

    def find_opportunity_lead(inputs)
      return find_opportunity_leads(inputs).first
    end

    def update_lead(inputs)
      api_method = UPDATE_OBJECT_METHOD["lead"]
      params = {'objects' => [inputs]}
      response = make_api_call(api_method, params)
      response['result']['updates'].first
    end

    def create_lead(inputs)
      api_method = CREATE_OBJECT_METHOD["lead"]
      params = {'objects' => [inputs]}
      response = make_api_call(api_method, params)
      response['result']['creates'].first
    end

    def update_opportunity(inputs)
      api_method = UPDATE_OBJECT_METHOD["opportunity"]
      params = {'objects' => [inputs]}
      response = make_api_call(api_method, params)
      response['result']['updates'].first
    end

    def create_opportunity(inputs)
      api_method = CREATE_OBJECT_METHOD["opportunity"]
      params = {'objects' => [inputs]}
      response = make_api_call(api_method, params)
      response['result']['creates'].first
    end

    def create_opportunity_lead(inputs)
      api_method = CREATE_OBJECT_METHOD["opportunityLead"]
      params = {'objects' => [inputs]}
      response = make_api_call(api_method, params)
      response['result']['creates'].first
    end

    def make_api_call(method, params)
      request_id = (0...20).map { ('a'..'z').to_a[rand(26)] }.join
      data = {
        method: method,
        params: params,
        id: request_id
      }.to_json

      response = RestClient.post @post_uri, data, :content_type => :json, :accept => :json

      JSON.parse(response.to_str)
    end
  end
end


