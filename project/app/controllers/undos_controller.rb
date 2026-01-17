class UndosController < ApplicationController
  skip_before_action :verify_authenticity_token
  layout "application"

  def show
    @history = session[:undo_deque] || []
  end

  def create
    command = EventMediator.undo_last_command(session)
    redirect_to undo_path
  end
end