import { GridTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

declare module '@mui/material/Grid' {
  interface GridTypeMap<P = {}, D extends React.ElementType = 'div'> {
    props: P & {
      item?: boolean;
      container?: boolean;
    };
    defaultComponent: D;
  }

  const Grid: OverridableComponent<GridTypeMap>;
  export default Grid;
}
