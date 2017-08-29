
<?php 
/* 
Template Name: Projects Portfolio 
*/

get_header(); 

?>
<div id="content-full-width" class="page-wrap">
    <div class="container content-wrapper">

        <div class="row">
            <div id="content-projects" class="page-wrap2">
                <div class="container content-wrapper">

                    <!-- ============ CONTENT START ============ -->
                    <section id="project-content">
                        
                        <div id="intro" class="row">          
                            <div class="col-sm-12 text-center">
                                <?php while ( have_posts() ) : the_post(); ?>
                                    <?php the_content() ?>
                                <?php endwhile; // end of the loop. ?>
                            </div>
                        </div>

                        <div id="filters-row" class="row">    
                            <div id="project-page" class="col-lg-12">
                                <ul class="nav navbar-nav navbar-left" id="filters">
                                    <?php
                                    $terms2 = get_terms("project_categories");
                                    $count = count($terms2);
                                    echo '<li><a href="javascript:void(0)" title="" data-filter=".all" class="active">All</a></li>';
                                    if ( $count > 0 ){
                                        foreach ( $terms2 as $term ) {                                      $termname = strtolower($term->name);
                                            $termname = str_replace(' ', '-', $termname);
                                            echo '<li><a href="javascript:void(0)" title="" class="" data-filter=".'.$termname.'">'.$term->name.'</a></li>';
                                        }
                                    } ?>
                                </ul>
                            </div>
                        </div>
                        
                        <div id="projects" class="row">
                            <!-- Start projects Loop -->
                            <?php  /* Query the post   */
                            $args = array( 'post_type' => 'projects', 'posts_per_page' => -1, 'orderby'=>'menu_order','order'=>'ASC' );
                            $loop = new WP_Query( $args );
                            while ( $loop->have_posts() ) : $loop->the_post(); 
                            /* Pull category for each unique post using the ID */
                            $terms = get_the_terms( $post->ID, 'project_categories' );   
                            if ( $terms && ! is_wp_error( $terms ) ) : 
                             $links = array();
                         foreach ( $terms as $term ) {
                             $links[] = $term->name;
                         }
                         $tax_links = join( " ", str_replace(' ', '-', $links));          
                         $tax = strtolower($tax_links);
                         else :  
                            $tax = '';                  
                        endif; ?>
                        
                        <?php echo '<div class="project col-sm-6 col-md-4 col-lg-3 all project-item '. $tax .'">';?>
                        <a href="<?php print get_permalink($post->ID) ?>">
                          <?php echo the_post_thumbnail(); ?></a>
                          <h4><?php print get_the_title(); ?></h4>
                          <?php print get_the_excerpt(); ?><br />
                          <a class="btn btn-default" href="<?php print get_permalink($post->ID) ?>">Details</a>
                      </div> <!-- End individual project col -->
                  <?php endwhile; ?> 
              </div><!-- End Projects Row -->
          </div><!-- End Container --> 
          <!-- ============ CONTENT END ============ -->

          <?php get_footer(); ?>