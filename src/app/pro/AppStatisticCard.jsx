import { StatisticCard } from '@ant-design/pro-components';
import { T } from '../../theme';

export const AppStatisticCard = ({ statistic, style, ...props }) => (
  <StatisticCard
    statistic={{
      valueStyle: {
        fontWeight: T.fontWeightStrong,
        color: T.colorTextBase,
        fontSize: 24,
      },
      ...statistic,
    }}
    style={{
      borderColor: T.colorBorderSecondary,
      boxShadow: 'none',
      minHeight: 152,
      overflow: 'hidden',
      ...style,
    }}
    {...props}
  />
);

AppStatisticCard.Group = StatisticCard.Group;

export default AppStatisticCard;
