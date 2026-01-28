import { createStyles, makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import { useRecoilValue } from "recoil";
import { searchResults } from "../../store/atoms";
import { Button } from "@mui/material";

export const UserList = () => {
  const searchResult = useRecoilValue(searchResults);
  const classes = UseStyle();

  const renderCompactCard = (item, type) => {
    const isUser = type === 'user';
    const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? `http://${window.location.host}`
      : `https://${window.location.hostname}`;

    const hasPersonal = isUser && item.assigned_trees_count > 0;
    const hasSponsored = item.sponsored_trees > 0;

    return (
      <div className={classes.compactCard} key={`${type}-${item.id}`}>
        {/* Avatar at top center */}
        <div className={classes.avatarSection}>
          <Avatar
            alt={item.name}
            src={item.profile_image || undefined}
            sx={{
              width: 72,
              height: 72,
              '& img': {
                objectFit: 'contain',
                padding: isUser ? 0 : '8px'
              }
            }}
          />
        </div>

        {/* Name */}
        <div className={classes.cardName} title={item.name}>
          {item.name}
        </div>
        {!isUser && item.group_type && (
          <div className={classes.cardSubtitle}>{item.group_type}</div>
        )}

        {/* Tree sections - centered if only one */}
        <div className={`${classes.treeSections} ${(hasPersonal && hasSponsored) ? '' : classes.treeSectionsCentered}`}>
          {hasPersonal && (
            <div className={classes.treeSection}>
              <div className={classes.treeSectionLabel}>Personal</div>
              <div className={classes.treeSectionCount}>{item.assigned_trees_count}</div>
              <Button
                variant="outlined"
                color="success"
                size="small"
                fullWidth
                onClick={() => window.open(`${baseUrl}/profile/user/${item.id}`)}
                className={classes.treeButton}
              >
                View
              </Button>
            </div>
          )}

          {hasSponsored && (
            <div className={classes.treeSection}>
              <div className={classes.treeSectionLabel}>Sponsored</div>
              <div className={classes.treeSectionCount}>{item.sponsored_trees}</div>
              <Button
                variant="contained"
                color="success"
                size="small"
                fullWidth
                onClick={() => window.open(`${baseUrl}/sponsorship/${item.id}`)}
                className={classes.treeButton}
              >
                View
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const users = searchResult.users || [];
  const groups = searchResult.groups || [];
  const hasAnyResults = users.length > 0 || groups.length > 0;

  if (!hasAnyResults) {
    return <div></div>;
  }

  // Check if both are empty
  const allEmpty = users.length === 0 && groups.length === 0;

  return (
    <div className={classes.container}>
      {allEmpty ? (
        <div className={classes.noResults}>
          <div className={classes.noResultsText}>No users or groups found</div>
        </div>
      ) : (
        <>
          {/* Groups Section - Show first if has results */}
          {groups.length > 0 && (
            <div className={classes.section}>
              <div className={classes.sectionHeader}>
                Groups ({groups.length})
              </div>
              <div className={classes.cardGrid}>
                {groups.map((group) => renderCompactCard(group, 'group'))}
              </div>
            </div>
          )}

          {/* Users Section - Always Show */}
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              Individual Users ({users.length})
            </div>
            {users.length > 0 ? (
              <div className={classes.cardGrid}>
                {users.map((user) => renderCompactCard(user, 'user'))}
              </div>
            ) : (
              <div className={classes.emptyState}>No individual users found</div>
            )}
          </div>

          {/* Groups Section - Show at end if empty */}
          {groups.length === 0 && (
            <div className={classes.section}>
              <div className={classes.emptyState}>No groups found</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const UseStyle = makeStyles((theme) =>
  createStyles({
    container: {
      width: "100%",
      paddingLeft: "0",
      paddingRight: "0",
    },
    section: {
      marginBottom: "32px",
      [theme.breakpoints.down("sm")]: {
        marginBottom: "24px",
      },
    },
    sectionHeader: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2e7d32",
      marginBottom: "16px",
      paddingLeft: "4px",
      borderBottom: "2px solid #e8f5e9",
      paddingBottom: "8px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
        marginBottom: "12px",
        paddingBottom: "6px",
      },
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "16px",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "12px",
      },
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr",
        gap: "12px",
      },
    },
    compactCard: {
      padding: "20px 16px",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transition: "all 0.2s",
      minHeight: "200px",
      minWidth: "0",
      "&:hover": {
        borderColor: "#2e7d32",
        boxShadow: "0 4px 12px rgba(46,125,50,0.2)",
        transform: "translateY(-2px)",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "16px 12px",
        minHeight: "180px",
      },
    },
    avatarSection: {
      marginBottom: "12px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      minWidth: "90px",
    },
    cardName: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
      textAlign: "center",
      marginBottom: "4px",
      width: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      paddingX: "4px",
    },
    cardSubtitle: {
      fontSize: "11px",
      color: "#666",
      textTransform: "capitalize",
      marginBottom: "12px",
      textAlign: "center",
    },
    treeSections: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      width: "100%",
      marginTop: "auto",
    },
    treeSectionsCentered: {
      justifyContent: "center",
    },
    treeSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      padding: "10px 8px",
      backgroundColor: "#f8f9fa",
      borderRadius: "6px",
      border: "1px solid #e9ecef",
    },
    treeSectionLabel: {
      fontSize: "11px",
      fontWeight: "500",
      color: "#666",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    treeSectionCount: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#2e7d32",
      lineHeight: 1,
    },
    treeButton: {
      textTransform: "none",
      fontSize: "12px",
      padding: "4px 8px",
      marginTop: "4px",
    },
    emptyState: {
      padding: "40px 24px",
      textAlign: "center",
      color: "#999",
      fontSize: "14px",
      fontStyle: "italic",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
    },
    noResults: {
      padding: "60px 24px",
      textAlign: "center",
    },
    noResultsText: {
      fontSize: "16px",
      color: "#666",
      fontWeight: "500",
    },
  })
);

export default UserList;
