class UndosController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    @history = session[:undo_deque] || []
    render json: @history.reverse
  end

  def create
    command = UndoService.new(session: session).call
    @history = session[:undo_deque] || []
    render json: {
      undone: command,
      history: @history.reverse
    }
  end
end