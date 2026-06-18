require_relative "handler"

# ONE job: append the event as a new line in a log file.
class FileHandler < Handler
  def initialize(path = "events.log")
    @path = path
  end

  def handle(event)
    # "a" = append mode, so old lines are kept.
    File.open(@path, "a") { |file| file.puts event.to_line }
  end
end
