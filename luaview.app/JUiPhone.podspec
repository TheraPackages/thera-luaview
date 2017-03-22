Pod::Spec.new do |s|
    s.name         = 'JUiPhone'
    s.version      = '4.7.2'
    s.summary      = '聚划算独立客户端'

    s.homepage     = 'http://gitlab.alibaba-inc.com/juhuasuanwireless/juiphone'
    s.license      = { :type => 'juhusuan.com', }
    s.author       = {'古伦' => 'gulun.ls@taobao.com' }

    s.description  = '聚划算独立客户端源码' \
                     '方便淘宝独立客户端聚划算插件使用，提取JHSKit和JUSDK-lite'
    s.platform     = :ios
    s.ios.deployment_target = '6.0'
    s.requires_arc = true

    s.source       = { :git => 'git@gitlab.alibaba-inc.com:juhuasuanwireless/juiphone.git',
                       :branch => 'plugin'}
    s.frameworks = 'Foundation', 'UIKit', 'CoreGraphics', 'QuartzCore'
    s.prefix_header_contents = '#import <UIKit/UIKit.h>', '#import <Foundation/Foundation.h>'


    s.subspec 'JHSKit' do |jhskit|
            jhskit.source_files = 'External/EXTScope/**/*.{h,m}', \
                            'JUiPhone/JHSPluginConfig/JHSKit-lite.h', \
                            'JUiPhone/JHSAppService/JULocalCollect/*.{h,m}', \
                            'JUiPhone/JHSAppService/UserProfile/*.{h,m}', \
                            'JUiPhone/JHSAppPages/Utilities/JHSPair/JHSPair.{h,m}', \
                            'JUiPhone/JHSAppPages/MyProfile/**/*.{h,m}', \
                            'JUiPhone/JHSBizFlow/**/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/TipsRuleMatcher/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/JHSError/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/Modules/**/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/LuaViewHelper/**/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/LuaViewController/**/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/FeatureSwitch/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/TabbarController/*.{h,m}', \
                            'JUiPhone/JHSBundleWrapper/ShakeActivity/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/CoreDefine/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/Location/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSCommonService/URLNavigator/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSCommonService/CommonConst/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSCommonService/UserInfo/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSCommonService/EnvService/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUTService/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSComponent/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSCoordinate/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSData/Models/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSLayout/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUI/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSWrapping/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKDOBase.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKTBTopResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKTBMTopResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKTBMTOPGetOptionResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKTBMTopGetOptionItemResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKItemJuListDetailResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKTBMTopRecommendResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKMiscTabbarResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/DO/JUSDKTBMTopOperationBannersGetResult.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/Request/JUSDKTBMTOPRequest.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/Request/JUSDKTBMTopGetOptionRequest.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/Request/JUSDKTBMTopGetOptionItemRequest.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/Request/JUSDKTBMTopGetCityNameListRequest.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/Request/JUSDKTBMTOPGetCityAreasRequest.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/Request/JUSDKTBMTopRecommendRequest.{h,m}', \
'JUiPhone/JHSCoreFoundation/Request/JUSDKTBMTopGetAvatarRequest.{h,m}', \

                            'JUiPhone/JHSCoreFoundation/Request/JHSRequestHelper.{h,m}', \
                            'JUiPhone/JHSUIComponent/Utilities/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/JHSCarouselView/**/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/JHSCycleScanView/**/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/Parallax/UIView+JHSParallax.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/Parallax/UIView+JHSMotion.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/ActionMenu/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/ActionMenu/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/CategoryPicker/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/Cells/**/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/IconFont/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/JHSBackTopView/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/JHSDDPageControl/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/JHSFrameAnimationView/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/JHSLikeButton/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/JHSRefreshFooter/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/KYCuteView/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/NavigationCategory/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/QuickMenu/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/SlideView/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/SNLinearMenu/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/SNPagingView/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/StatusInfoView/**/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/FloatingTips/**/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/CustomSystemUI/**/UIViewController+SystemTransition.{h,m}', \
                            'JUiPhone/JHSUIComponent/Core/Utilities/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Core/Alert/*.{h,m}', \
                            'JUiPhone/JHSUIComponent/Core/ActivityView/JUActivityView.{h,m}', \
                            'JUiPhone/JHSRuntime/AliAdapter/JHSAdapter/**/*.{h,m}'


        jhskit.exclude_files = 'JUiPhone/JHSBizFlow/RedDot/JHSMessageReddotCenter.{h,m}', \
                            'JUiPhone/JHSBizFlow/RedDot/JHSReddotCenter.{h,m}', \
                            'JUiPhone/JHSBizFlow/JuCollection/*.{h,m}', \
                            'JUiPhone/JHSBizFlow/Home/JHSListSortBarView.{h,m}', \
'JUiPhone/JHSAppPages/MyProfile/JULocalItemListViewController.{h,m}', \
                            'JUiPhone/JHSBizFoundation/Modules/AnchorManager/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/Modules/PageLoader/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/Modules/ProtocolForwarding/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/Modules/ServiceDependency/ProtocolForwarding/*.{h,m}', \
                            'JUiPhone/JHSBizFoundation/Modules/Query/JHSUserActionsQuery.{h,m}', \
                            'JUiPhone/JHSBizFoundation/Modules/DataSource/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUI/Sms/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUI/JHSRefreshHeader/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUI/ThunderBall/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUI/GEImageView/**/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSComponent/Box/JHSBoxGEImageViewDelegate.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/URL/*.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/JHSAppUtility.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/JULog.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/TB_UIViewAdditions.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/UIView+WhenTappedBlocks.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/NSAttributedString+JHSContuctors.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/NSDate+JHSEx.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/NSMutableString+JHSModify.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/NSString+Compare.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/NSString+JHSAttributes.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/NSString+Replacement.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/NSURL+scheme.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Categories/UILabel+JHSAttributes.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUtilities/Location/MapUtil.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSWrapping/DataSourceService/DSBizService/JHSMessageListItemParams.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSData/Models/JHSOptionItemProductModel+Collect.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSData/Models/JHSBoxMessageModel.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSData/Models/JUActionPopupMenuTextOption.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSWrapping/DataSourceService/DSBizService/JHSMessageDataSourceBizService.{h,m}', \
                            'JUiPhone/JHSCoreFoundation/JHSUTService/JHSUTHelperDelegate.{h,m}', \
                            'JUiPhone/JHSUIComponent/Core/Utilities/UIView+LoadDefaultNib.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/Cells/**/JHSDoubleItemListTableViewCell.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/Cells/**/JHSBaseTableViewCell.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/Cells/**/JHSLoadNextPageCell.{h,m}', \
                            'JUiPhone/JHSUIComponent/Biz/Cells/**/JHSModelStatusInfoCell.{h,m}'


        jhskit.resource_bundles = {'JHSKit' => 'JUiPhone/Vendor/JHSKit/Resources/**/*.{plist,png,jpg,xib,json,ttf,csv,zip,der}'}
        jhskit.requires_arc = true
        jhskit.prefix_header_file = 'JUiPhone/JHSPluginConfig/JHSKit-Prefix.pch'


        jhskit.xcconfig = { 'HEADER_SEARCH_PATHS' =>  '"../../JHSPlugin/JHSPluginCore/Classes/Plugin/Headers/**" '\
                                '"../../JHSPlugin/JHSPluginCore/Vendor/Pinyin/Headers/**" '\
                                '"../../JHSPlugin/JHSPluginCore/Vendor/juhuasuan/JUiPhone/Headers/**"' }

end

end
