class Idea < ActiveRecord::Base
  attr_accessible :cover_img_file_name, :description, :name
  belongs_to :user, :foreign_key => 'user_id'
  has_many   :resources
  has_many :repositories
  has_many :users, through: :repositories
  has_attached_file :cover_img, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.png"
  validates_attachment :cover_img, content_type: { content_type: ["image/jpeg", "image/jpg", "image/png", "image/gif"] }
  validates :name, :presence => true
end
