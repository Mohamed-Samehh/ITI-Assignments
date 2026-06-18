require_relative "handler"

# ONE job: keep an HTML dashboard up to date.
# It remembers every event it has seen and rewrites the WHOLE page each time
# (that is the "regenerate the full page on every event" rule).
class HtmlHandler < Handler
  def initialize(path = "dashboard.html")
    @path   = path
    @events = []
  end

  def handle(event)
    @events << event
    File.write(@path, page)   # overwrite the file with the full, fresh page
  end

  private

  def page
    rows = @events.map { |e| "    <li>#{e.to_line}</li>" }.join("\n")
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head><title>LifeTrack Dashboard</title></head>
        <body>
          <h1>LifeTrack Dashboard</h1>
          <ul>
      #{rows}
          </ul>
        </body>
      </html>
    HTML
  end
end
