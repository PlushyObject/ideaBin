class ResourcesController < ApplicationController
  before_filter :authenticate_user!
	#before_action :set_resource, except: [:new, :create, :index]
	respond_to :html, :json
	
  # GET /resources
  # GET /resources.json
  def index
    @resources = []
	Dir.glob("#{params[:path]}/*").each do |f| 
		unless File.directory?(f)
			@resources.push(File.basename(f))
		end
	end
	
	render json: @resources
  end

  # GET /resources/1
  # GET /resources/1.json
  def show
		send_file(params[:path])
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
    data =params[:data]
   # data.gsub('\\', '')

    resource = ActiveSupport::JSON.decode(data)
    logger.debug "REPO ID ::  #{resource}"
    @repo = Repository.find(resource["repo_id"])

    post = DataFile.save(params['file'], @repo.path)
    
    Dir.chdir(@repo.path)
		@git = Git.init()
		@git.add(:all => true)
		@git.commit(params[:comment])
   
		@resource = Resource.new
		@resource.repo_id = params[:repo_id]
		@resource.filename = params[:file].original_filename
		@resource.content_type = params[:file].content_type
		@resource.comment = params[:comment]
		@resource.directory_id = params[:directory_id]
	
		if(@resource.save)
			respond_with(@resource)
		else
			render json: {error: "File is already up to date"}
		end
  end

  # PUT /resources/1
  # PUT /resources/1.json
  def update
    @resource = Resource.find(params[:id])
	@parentDir = Directory.find(@resource.directory_id)
		
	file_path = "#{@parentDir.path}/#{@resource.filename}"
		
    respond_to do |format|
      if File.open(file_path, 'w') {|f| f.write(params[:content]) }
				Dir.chdir(@parentDir.path)
				@git = Git.init()
				@git.add(:all => true)
				@git.commit(params[:comment])
				
        format.json { head :no_content }
      else
        format.json { render json: @resource.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /resources/1
  # DELETE /resources/1.json
  def destroy
    @repo = Repository.find(params[:id])
		
		#REMOVE FILE FROM FILE SYSTEM AND DO A GIT commit
		if(FileUtils.rm(params[:path]))
			Dir.chdir(@repo.path)
			@git = Git.init()
			@git.add(:all => true)
			@git.commit("Removed file :: #{params[:path]}")
		end

  end
	
	#GET /resources/1/contents.json
	def contents
		extname = File.extname(params[:filename])[1..-1]
    mime_type = Mime::Type.lookup_by_extension(extname)
    content_type = mime_type.to_s unless mime_type.nil?

		@content = IO.read("#{params[:path]}/#{params[:filename]}")
		
		if(@content)
			render text: @content
		else
			render plain: "OH NO!"
		end
	end
	
	# GET /resources/1
  # GET /resources/1.json
  def download
		send_file(params[:path])
  end
	
	private
		def set_resource
      @resource = Resource.find(params[:id])
    end

    def resource_params
      #params.require(:resource).permit(:name)
    end
end
