/**
 * Created by luizfilipe on 10/12/14.
 */

'use strict';

module.exports = function() {
    return {
        scope: { avatar: '=avatar'  },
        link: function(scope, element, attrs) {
            scope.$watch('avatar', function(newValue) {
                if (attrs.type === 'background-image')
                {
                    if (newValue == null)
                    {
                        element.css('background-image',
                            'url(img/default_user.png)');
                    }
                    else
                    {
                        element.css('background-image',
                            'url(' + newValue + ')');
                    }
                }
                else
                {
                    if (newValue == null)
                    {
                        element.attr('src', 'img/default_user.png');
                    }
                    else
                    {
                        element.attr('src', newValue);
                    }
                }
            });
        }
    };
};