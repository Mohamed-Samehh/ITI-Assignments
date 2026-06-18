# LifeTrack — run this file:  ruby lifetrack.rb
require_relative "event"
require_relative "event_router"
require_relative "console_handler"
require_relative "file_handler"
require_relative "html_handler"

# --- Wiring -----------------------------------------------------------------
# This is the ONLY place that names the concrete outputs. To add a new output
# later, you create one new file and add ONE register line here. Nothing else
# changes (this is the Open/Closed principle in action).
router = EventRouter.new
router.register(ConsoleHandler.new)
router.register(FileHandler.new)
router.register(HtmlHandler.new)

# Menu choice -> category label.
CATEGORIES = {
  "1" => "work",
  "2" => "study",
  "3" => "exercise",
  "4" => "meal"
}

# --- Menu loop --------------------------------------------------------------
loop do
  puts
  puts "=== LifeTrack ==="
  puts "1. Log a work session"
  puts "2. Log a study session"
  puts "3. Log an exercise session"
  puts "4. Log a meal"
  puts "5. Exit"
  puts
  print "Choose an option: "
  choice = gets.chomp

  break if choice == "5"

  category = CATEGORIES[choice]
  if category.nil?
    puts "Invalid option, please try again."
    next
  end

  print "Description: "
  description = gets.chomp
  print "Duration (minutes): "
  duration = gets.chomp.to_i

  event = Event.new(category, description, duration)

  puts
  router.dispatch(event)   # <- all outputs fire here, together
  puts "✓ Event logged."
end

puts "Goodbye!"
