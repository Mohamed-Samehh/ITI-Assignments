require_relative "handler"

# ONE job: print the event to the terminal.
class ConsoleHandler < Handler
  def handle(event)
    puts event.to_line
  end
end
