class AddLocalToGame < ActiveRecord::Migration[6.1]
  def change
    add_column :games, :local, :boolean
  end
end
