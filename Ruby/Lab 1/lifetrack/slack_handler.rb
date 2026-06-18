require_relative "handler"

# BONUS: the new "Slack notification" output the product manager asked for.
# Notice: adding this did NOT touch the router or the Handler interface.
# (Real Slack needs a webhook URL; here we just print to prove the design.)
class SlackHandler < Handler
  def handle(event)
    puts "📣 (Slack) #{event.to_line}"
  end
end

# To turn it on, open ONLY lifetrack.rb and add these two lines:
#   require_relative "slack_handler"
#   router.register(SlackHandler.new)
