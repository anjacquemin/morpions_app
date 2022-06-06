class AddNumberOfPlayertoGame < ActiveRecord::Migration[6.1]
  def change
    add_column :games, :number_of_players, :integer
  end
end
