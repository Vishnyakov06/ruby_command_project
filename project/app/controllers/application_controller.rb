class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes
  rescue_from ApplicationError, with: :render_application_error

  private

  def render_application_error(error)
    status = case error
             when NotFoundError
               :not_found
             when ValidationError
               :unprocessable_entity
             when DuplicateError
               :conflict
             when DatabaseError
               :service_unavailable
             else
               :internal_server_error
             end

    render json: {
      error: error.class.name,
      message: error.message,
      code: error.code,
      details: error.details
    }, status: status
  end
end
