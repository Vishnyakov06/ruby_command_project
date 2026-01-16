class UndoController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    command = CommandHistory.pop

    if command
      command.undo
      render json: { success: true, message: command.class.name }
    else
      render json: { success: false, message: "Нечего отменять" }
    end
  rescue => e
    render json: { success: false, message: e.message }
  end
end