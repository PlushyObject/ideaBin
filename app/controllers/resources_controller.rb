class ResourcesController < ApplicationController
  before_filter :authenticate_user!
	#before_action :set_resource, except: [:new, :create, :index]
	respond_to :json
	
  # GET /resources
  # GET /resources.json
  def index
    @resources = Resource.where(directory_id: params[:directory_id])
    respond_with(@resources)
  end

  # GET /resources/1
  # GET /resources/1.json
  def show
    @resource = Resource.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @resource }
    end
  end

  # GET /resources/new
  # GET /resources/new.json
  def new
    @resource = Resource.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @resource }
    end
  end

  # GET /resources/1/edit
  def edit
    @resource = Resource.find(params[:id])
		respond_with(@resource)
  end

	#Takes directory id and resouce in.
	#
  # POST /resources
  # POST /resources.json
  def create
    @parentDir = Directory.find(params[:directory_id])
		
    post = DataFile.save(params['file'], @parentDir.path)
    
    Dir.chdir(@parentDir.path)
		@git = Git.init()
		@git.add(:all => true)
		@git.commit(params[:comment])
   
		@resource = Resource.new
		@resource.idea_id = params[:idea_id]
		@resource.filename = params[:file].original_filename
		@resource.content_type = params[:file].content_type
		@resource.comment = params[:comment]
		@resource.directory_id = params[:directory_id]
	
		@resource.save
		respond_with(@resource)
  end

  # PUT /resources/1
  # PUT /resources/1.json
  def update
    @resource = Resource.find(params[:id])
		@parentDir = Directory.find(@resource.directory_id)
		
		directory = @directory.path = "#{@parentDir.path}"
		#write params[:text] to resource file
    respond_to do |format|
      if @resource.update_attributes(params[:resource])
        format.html { redirect_to @resource, notice: 'Resource was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @resource.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /resources/1
  # DELETE /resources/1.json
  def destroy
    @resource = Resource.find(params[:id])
    
		
		@directory = Directory.find(@resource.directory_id)
		image_path = "#{@directory.path}/#{@resource.filename}"
		if(FileUtils.rm(image_path))
		
			@resource.destroy
			Dir.chdir(@directory.path)
			@git = Git.init()
			@git.add(:all => true)
			@git.commit("Removed file :: #{@resource.filename}")
		end
		#REMOVE FILE FROM FILE SYSTEM AND DO A GIT commit
    respond_to do |format|
      format.json { head :no_content }
    end
  end
	
	#GET /resources/1/contents.json
	def contents
		@resource = Resource.find(params[:id])
		@directory = Directory.find(@resource.directory_id)
		
		if(@resource)
			render file: "#{@directory.path}/#{@resource.filename}"
		end
	end
	
	private
		def set_resource
      @resource = Resource.find(params[:id])
    end

    def resource_params
      #params.require(:resource).permit(:name)
    end
end
