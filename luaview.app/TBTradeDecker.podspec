Pod::Spec.new do |s|


  s.name         = "TBTradeDecker"
  s.version      = "0.0.1"
  s.summary      = "TBTradeDecker bundle."

  s.description  = <<-DESC
                   TBTradeDecker description
                   commit:${commit}
                   DESC

  s.homepage     = "http://gitlab.alibaba-inc.com/wireless/tbtradedecker.git"
  s.license = {
    :type => 'Copyright',
    :text => <<-LICENSE
           Alibaba-INC copyright
    LICENSE
  }

  s.author       = { "婉谦" => "wanqian.rl@taobao.com" }

  s.platform     = :ios

  s.ios.deployment_target = '7.0'

  
  s.source       =  { :http => "${url}" } 

  #s.subspec 'Framework' do |framework|
  #  framework.vendored_frameworks = 'TBTradeDecker.framework'
  #  framework.resources = 'TBTradeDecker.framework/Versions/A/Resources/*'
  #  framework.exclude_files = "TBTradeDecker.framework/Versions/A/Resources/Info.plist"
  #end

  s.source_files = 'TBTradeDecker/Source/**/*.{h,m,mm}','TBTradeDecker/PublicService/TBOrderServiceProtocol.h','TBTradeDecker/TBTradeDecker.h'
  s.resources = 'TBTradeDecker/Resources/*.{jpg,png,xib,wav,plist}', 'TBTradeDecker/Source/**/*.{jpg,png,xib,wav,plist}'
  s.requires_arc = true
  s.prefix_header_file = 'TBTradeDecker/TBTradeDecker-Prefix.pch'

end
