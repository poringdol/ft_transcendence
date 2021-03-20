require 'test_helper'

class GuildControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get guild_index_url
    assert_response :success
  end

end
