class PartialsController < ApplicationController
  def show
    name = params[:name]
    render partial: "frontend/#{name}"
  end
end