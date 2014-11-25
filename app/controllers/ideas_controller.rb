class IdeasController < ApplicationController
  before_filter :authenticate_user!
	before_action :set_idea, except: [:new, :create, :index]
	respond_to :html, :json
	
  # GET /ideas
  # GET /ideas.json
  def index
    @ideas = Idea.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @ideas }
    end
  end

  # GET /ideas/1
  # GET /ideas/1.json
  def show
    @idea = Idea.find(params[:id])

		respond_with(@idea)
  end

  # GET /ideas/new
  # GET /ideas/new.json
  def new
    @idea = Idea.new
		
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @idea }
    end
  end

  # GET /ideas/1/edit
  def edit
    @idea = Idea.find(params[:id])
    session[:idea_id] = params[:id] 
		@directoryParent = Directory.where("idea_id = ? AND is_top = ?", @idea.id, true).take
		session[:directory_id] = @directoryParent.id

    repo_path = "#{Rails.root}/public/data/repository/#{current_user.id}/#{@idea.name}"
  
    #clone idea repo from owners copy if current user isn't owner
    if(current_user.id != @idea.user_id)
      unless File.exists?(repo_path)
        Dir.mkdir(repo_path)
      end

      Dir.chdir(repo_path)
    	@git = Git.clone(repo_path, @idea.name)
    end
		
		respond_with(@idea)
		#respond_to do |format|
    #  if @idea.save and @directory.save
    #    format.html { redirect_to @idea, notice: "Idea was successfully created.#{g}" }
    #    format.json { render json: @idea, status: :created, location: @idea }
    #  else
    #    format.html { render action: "new" }
    #    format.json { render json: @idea.errors, status: :unprocessable_entity }
    #  end
    #end
  end

  # POST /ideas
  # POST /ideas.json
  def create
    @idea = Idea.new(idea_params)
		@idea.description = params[:description]

    @idea.user_id = current_user.id
    directory = "#{Rails.root}/app/assets/images/cover_images/"
		#if params[:idea][:cover_img]
		#		@idea.cover_img = params[:idea][:cover_img].original_filename
		#end

			#DataFile.save(params[:idea][:cover_img], directory)
			repo_path = "#{Rails.root}/public/data/repository/#{current_user.id}" 
		unless File.exists?(repo_path)
			Dir.mkdir(repo_path)
		end
		
		if @idea.save
				#create directory in database to associate the directory created in the file systems.
			@directory = Directory.new()
			@directory.name = @idea.name
			@directory.idea_id = @idea.id
			@directory.path = repo_path
			@directory.is_top = true
			Dir.chdir(repo_path)	
			g = Git.init(@idea.name)

			if params[:alteredStatus] == '1'
				@gitcommit = "it was committed"
				@git.add(:all => true)
				@git.commit('this is a commit...REMEMBER TO CHANGE THIS TO USER DEFINED MESSAGE')
			end   
			@directory.save
		end
		respond_with(@idea)
    #respond_to do |format|
    #  if @idea.save and @directory.save
    #    format.html { redirect_to @idea, notice: "Idea was successfully created.#{g}" }
    #    format.json { render json: @idea, status: :created, location: @idea }
    #  else
    #    format.html { render action: "new" }
    #    format.json { render json: @idea.errors, status: :unprocessable_entity }
    #  end
    #end
  end

  # PUT /ideas/1
  # PUT /ideas/1.json
  def update
    @idea = Idea.find(params[:id])

    repo_path = "#{Rails.root}/public/data/repository/#{current_user.id}/#{@idea.name}"
		cover_img_path = "#{Rails.root}/public/images/cover_images/"
		
		if params[:idea][:cover_img]
				@idea.cover_img = params[:idea][:cover_img].original_filename
		end
		
		DataFile.save(params[:idea][:cover_img], cover_img_path)

    Dir.chdir(repo_path)
    @git = Git.init
    @gitcommit = ""
    if params[:alteredStatus] == '1'
      @gitcommit = "it was committed"
      @git.add(:all => true)
      @git.commit('this is a commit...REMEMBER TO CHANGE THIS TO USER DEFINED MESSAGE') 
    end

	
    respond_to do |format|
      if @idea.update_attributes(params[:idea])
        format.html { redirect_to action: "index", notice: "#{@gitcommit} ... #{params[:alteredStatus]} Idea was successfully updated." }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @idea.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ideas/1
  # DELETE /ideas/1.json
  def destroy
    @idea = Idea.find(params[:id])
    repo_path = "#{Rails.root}/public/data/repository/#{current_user.id}/#{@idea.name}"
    FileUtils.rm_rf(repo_path)
    @idea.destroy

    respond_with(@idea)
 end
 
 private
    def set_idea
      @idea = Idea.find(params[:id])
    end

    def idea_params
      params.require(:idea).permit(:name)
    end
end
